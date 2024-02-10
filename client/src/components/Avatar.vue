<template>
  <div class="avatar-container">
    <div class="avatar" :style=style(avatarUrl,size)></div>
  </div>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    avatarUrl: String,
    size: Number,
  },
  methods: {
    style(avatarUrl,size) {
      var style =
      `width: ${size}rem;
      height: ${size}rem;
      border: solid ${size * 0.1}rem transparent;
      --border: -${size * 0.1}rem;`;
      if(avatarUrl != null) {
        style += `background-image: url('${avatarUrl}');`;
      }
      return style;
    }
  },
};
</script>