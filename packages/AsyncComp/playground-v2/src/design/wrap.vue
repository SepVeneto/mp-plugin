<template>
  <DesignEntry v-if="type === 'entry'" />

  <DesignButton v-else-if="type === 'button'" />

  <view v-else>{{ type }}</view>
</template>

<script>
import DesignEntry from './DesignEntry.vue';
import DesignButton from './DesignButton.vue';
export default {
  components: {
    DesignEntry,
    DesignButton,
  },
  props: {
    type: {
      type: String,
      required: true,
    }
  }
}
</script>
