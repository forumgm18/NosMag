import { createPopper } from '@popperjs/core';

export default ({ctx}, inject) => {
  //ctx.createPopper = new createPopper()
  inject('createPopper1', createPopper())
  }
