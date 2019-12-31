<template>
  <div v-if="steps.length" class="s-steps">
    <div v-for="(step, index) in steps" :key="index" class="s-step" :class="index === steps.length - 1 ? 's-step_last' : ''">
      <div class="s-step_head">
        <div v-if="index !== steps.length - 1" class="s-step_line" :class="step.active && steps[index + 1] && steps[index + 1].active ? 'is-active' : ''"></div>
        <div class="s-step_icon" :class="step.active ? 'is-active' : ''"></div>
      </div>
      <div class="s-step_main">
        <div class="s-step_title">{{step.title}}</div>
        <div class="s-step_desc">
          <div>{{step.time | date('yyyy-MM-dd')}}</div>
          <div>{{step.time | date('hh:mm:ss')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      value: []
    }
  }
}
</script>

<style scoped>
.s-steps {
  position: relative;
  display: flex;
  white-space: nowrap;
  align-items: baseline;
  margin-top: 40px;
}

.s-step {
  position: relative;
  flex: 1;
  display: inline-block;
}

.s-step_head {
  position: relative;
  width: 100%;
}

.s-step_main {
  margin-top: 5px;
}

.s-step_line {
  position: absolute;
  height: 8px;
  top: 8px;
  left: 2px;
  right: -1px;
  border-color: inherit;
  background-color: #d5d5d5;
}
.s-step_icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  font-size: 14px;
  box-sizing: border-box;
  background: #fff;
  transition: .15s ease-out;
  border-radius: 100%;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAAAAADFHGIkAAAAmklEQVQoz3VSuw7DMAjk///PIFddLHuJnEqNtyLVZAC7VhNuAg7B8QBRcE0PpGeqbAHQcAkThX9Eo7CA3oN4hT/sShzhgkMEhOlKEAtICTfIAjzVtP5tM4uhmrWp/M3cCsnyba5ROUFUow2iqR8B1eiD6OqjT7il3Oau3HXAvg4o2VmJv0R37f6h/NOK8KIgL8+g7xMRY6ofC5y2jgCTNutZZAAAAABJRU5ErkJggg==);
}

.s-step_head .s-step_line.is-active{
  background-color: #48e;
}
.s-step_head .s-step_icon.is-active{
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAflBMVEVEiO5FiO5Fie5Gie5Iiu5Ii+5Ji+5Nju9Oju9YlfBZlfBhm/F3qfN4qfOFsfSFsvSGsvSHsvSHs/SbwPacwPanx/eox/eryfesyveuy/i91fm+1fm+1vm/1vnG2/rH2/rm7/3n8P3o8P3o8f3p8f32+f76/P/7/P/7/f////9gA+K2AAAAtElEQVQoz3VSWxKCMAwMiNQqFKiCL6AKFen9L6hOGkUx+7WbnTZPcAhbJutYbNLy6gOA4WwBHmFmP0a7ggnEmYxjCF8IDmg0AfwgaF6GFTCDsE8jhz9QDnpKULTDzRRUWw+Vp1ssf+dlBSmS3PflNOoUJBJDhkEtIUYykHFHveQN9qsEiZ4lZ8vtqEFtxtFoarADp5iR8EN09XzsNbOoPbPa0+QY1PtRqCbHgOcjo0gm5cUHHusLISW0KAP+AAAAAElFTkSuQmCC);
}

.s-step_last {
  flex: none;
  position: absolute;
  top: 0;
  right: -1px;
  width: 150px;
  text-align: right;
}

.s-step_title {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
.s-step_desc {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}
</style>
