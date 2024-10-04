<script setup lang="ts">

</script>

<template>
  <ul class="shapes">
    <li v-for="$i in 10" :key="$i" />
  </ul>
</template>

<style scoped lang="scss">
$circle-positions: (
  1: 25%,
  2: 10%,
  3: 70%,
  4: 40%,
  5: 65%,
  6: 75%,
  7: 35%,
  8: 50%,
  9: 20%,
  10: 85%
);

$circle-sizes: (
  1: 80px,
  2: 20px,
  3: 20px,
  4: 60px,
  5: 20px,
  6: 110px,
  7: 150px,
  8: 25px,
  9: 15px,
  10: 150px
);

$animation-delays: (
  1: 0s,
  2: 2s,
  3: 4s,
  4: 0s,
  5: 0s,
  6: 3s,
  7: 7s,
  8: 15s,
  9: 2s,
  10: 0s
);

$animation-durations: (
  1: 10s,
  2: 12s,
  3: 10s,
  4: 18s,
  5: 10s,
  6: 10s,
  7: 10s,
  8: 45s,
  9: 35s,
  10: 11s
);

@mixin circle-style($left, $size, $delay, $duration) {
  left: $left;
  width: $size;
  height: $size;
  animation-delay: $delay;
  animation-duration: $duration;
}

.shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: #fff;
    animation: animate 25s linear infinite;
    bottom: -150px;
    z-index: 0;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        @include circle-style(map-get($circle-positions, $i),
          map-get($circle-sizes, $i),
          map-get($animation-delays, $i),
          map-get($animation-durations, $i));
      }
    }
  }
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}
</style>
