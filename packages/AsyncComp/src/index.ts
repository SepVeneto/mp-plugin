import path from 'node:path'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { analyzeComponent } from './lib/analyze-component'
import {
  findReplaceMap,
  replaceAllPolyfill,
  formatReplaceRefList,
  removeFirstSlash,
  updateAssetSource,
} from './lib/helper';
import { HTML_MAP, CSS_MAP } from './lib/constants'
import type { IDispatchVueOptions, IMovingComponents, IReplaceRefList } from './lib/types';

export const NAME = 'unplugin-mp-dispatch-comp'

const postFix = {
  html: HTML_MAP.MP_WX,
  css: CSS_MAP.MP_WX,
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => {
  return {
    name: NAME,
    webpack(compiler) {
      compiler.hooks.emit.tap('moveComponentPlugin', (comilation) => {
        // 预计会输出的所有文件
        const assets = comilation.assets

        const {
          parsedReplaceRefList,
          movingComponents
        } = analyzeComponent() || {}
        if (!movingComponents || !parsedReplaceRefList) return

        copyComponents(assets, movingComponents)
        modifyRef(assets, parsedReplaceRefList)
        deleteComponents(assets, movingComponents)

      })

      function copyComponents(
        assets: Record<string, any>,
        movingComponents: IMovingComponents,
      ) {
        for (const item of movingComponents) {
          const { sourceRef, targetRef, subPackage } = item;
          const origin = removeFirstSlash(sourceRef);
          const target = removeFirstSlash(targetRef);

          const vendor = [subPackage, 'common/vendor.js'].join('/');
          let insertCode = '';

          // 默认开启
          if (assets[vendor]) {
            console.log('[copyComponents] 存在vendor', vendor);
            const vendorRelativePath = path.relative(path.dirname(path.resolve(target)), path.resolve(vendor))
              .split(path.sep)
              .join('/');
            console.log('[copyComponents] vendorRelativePath', vendorRelativePath);

            insertCode = `require('${vendorRelativePath}');`;
          }

          const copyDirReg = options?.copyDir || /node_modules|uni_modules/
          if (copyDirReg.test(origin)) {
            addCompChunks(assets, origin, target, insertCode);
          } else {
            addCompChunk(assets, origin, target, '.js', insertCode);
            addCompChunk(assets, origin, target, '.json');
            addCompChunk(assets, origin, target, postFix.html);
            addCompChunk(assets, origin, target, postFix.css);
          }
        }
      }

      function deleteComponents(assets: Record<string, any>, movingComponents: IMovingComponents) {
        for (const item of movingComponents) {
          const { sourceRef } = item;
          const origin = removeFirstSlash(sourceRef);

          // TODO: remove dir
          deleteFile(assets, origin, '.js');
          deleteFile(assets, origin, '.json');
          deleteFile(assets, origin, postFix.html);
          deleteFile(assets, origin, postFix.css);
        }
      }

      function deleteFile(assets: Record<string, any>, name: string, postfix: string) {
        delete assets[name + postfix];
      }

      function getFileInfo(origin: string) {
        const folderList = origin.split('/')
        const filename = folderList.splice(-1)[0]
        return { dir: folderList.join('/'), file: filename }
      }
      function addCompChunk(
        assets: Record<string, any>,
        origin: string,
        target: string,
        postfix: string,
        insertCode = '',
      ) {
        /**
        * assets 的 keys 列表示例，可以看到没有前面的 `/`
        *
        * [
        *   "views/sche/cycle-set.wxml",
        *   "views/match-detail/publish-news.wxml",
        *   "wxcomponents/vant/mixins/basic.d.ts",
        *   "local-component/module/tip-match/tip-match-detail-group-qrcode/index.json",
        * ]
        */
        if (assets[origin + postfix]) {
          let source = assets[origin + postfix].source().toString();
          if (postfix === '.js' && !source.startsWith(insertCode)) {
            source = `${insertCode}${source}`;
          }
          updateAssetSource(assets, target + postfix, source);
        }
      }

      function addCompChunks(
        assets: Record<string, any>,
        origin: string,
        target: string,
        insertCode = '',
      ) {
        /**
        * assets 的 keys 列表示例，可以看到没有前面的 `/`
        *
        * [
        *   "views/sche/cycle-set.wxml",
        *   "views/match-detail/publish-news.wxml",
        *   "wxcomponents/vant/mixins/basic.d.ts",
        *   "local-component/module/tip-match/tip-match-detail-group-qrcode/index.json",
        * ]
        */
        const dir = getFileInfo(origin).dir
        const allFile = Object.keys(assets).filter(asset => asset.startsWith(dir))
        for (const filepath of allFile) {
          let source = assets[filepath].source().toString()
          if (filepath.endsWith('.js') && !source.startsWith(insertCode)) {
            source = `${insertCode}${source}`;
          }
          const { file } = getFileInfo(filepath)
          const { dir: targetdir } = getFileInfo(target)
          updateAssetSource(assets, [targetdir, file].join('/'), source);
        }
        // if (assets[origin + postfix]) {
        //   let source = assets[origin + postfix].source().toString();
        //   if (postfix === '.js' && !source.startsWith(insertCode)) {
        //     source = `${insertCode}${source}`;
        //   }
        //   updateAssetSource(assets, target + postfix, source);
        // }
      }

      function modifyRef(assets: Record<string, any>, parsedReplaceRefList: IReplaceRefList) {
        const refMap = formatReplaceRefList(parsedReplaceRefList);
        replaceAllPolyfill();

        for (const key of Object.keys(assets)) {
          const value = assets[key];
          const replaceList = findReplaceMap(key, refMap);

          if (replaceList?.length && (key.endsWith('.js') || key.endsWith('.json'))) {
            let source = value.source().toString();

            for (const replaceItem of replaceList) {
              source = source.replaceAll(`${replaceItem[0]}'`, `${replaceItem[1]}'`);
              source = source.replaceAll(`${replaceItem[0]}"`, `${replaceItem[1]}"`);
              source = source.replaceAll(`${replaceItem[0]}-create-component'`, `${replaceItem[1]}-create-component'`);
              source = source.replaceAll(`${replaceItem[0]}-create-component"`, `${replaceItem[1]}-create-component"`);
            }

            updateAssetSource(assets, key, source);
          }
        }
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
