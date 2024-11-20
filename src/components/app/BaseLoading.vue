<template>
   <div class="fixed inset-0 z-[1000] flex justify-center items-center bg-white bg-opacity-10 backdrop-blur-[2px]">
      <div class="spinner">
         <div></div>
         <div></div>
         <div></div>
         <div></div>
         <div></div>
      </div>
   </div>
</template>

<style>
.spinner {
   width: 56px;
   height: 56px;
   border-radius: 50%;
   background: radial-gradient(farthest-side, #faca15 94%, #0000) top/9px 9px no-repeat,
      conic-gradient(#0000 30%, #faca15);
   -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
   animation: spinner-c7wet2 1s infinite linear;
}

@keyframes spinner-c7wet2 {
   100% {
      transform: rotate(1turn);
   }
}
</style>