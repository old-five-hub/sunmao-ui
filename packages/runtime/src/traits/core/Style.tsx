import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';

const StyleTraitFactory: TraitImplFactory<Static<typeof PropsSpec>> = () => {
  return ({ styles }) => {
    const customStyle: Record<string, string> = {};
    styles.forEach(style => {
      customStyle[style.styleSlot] = style.style;
    });
    let interval: ReturnType<typeof setInterval> | undefined;
    return {
      props: {
        customStyle,
        didMountHooks: [],
        didUpdateHooks: [
          () => {
            if (interval) {
              clearInterval(interval);
            }
            interval = setInterval(() => {
              console.log(2333);
            }, 2000);
            console.log('开始计时', interval);
          },
        ],
        unmountHooks: [
          () => {
            console.log('停止计时', interval);
            if (interval) {
              clearInterval(interval);
              interval = undefined;
            }
          },
        ],
      },
    };
  };
};

const PropsSpec = Type.Object({
  styles: Type.Array(
    Type.Object({
      styleSlot: Type.String(),
      style: Type.String(),
    })
  ),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'style',
      description: 'add style to component',
    },
    spec: {
      properties: PropsSpec,
      methods: [],
      state: {},
    },
  }),
  factory: StyleTraitFactory,
};
