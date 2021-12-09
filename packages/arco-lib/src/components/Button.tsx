import { Button as BaseButton } from "@arco-design/web-react";
import { ComponentImplementation, Slot } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ButtonPropsSchema } from "../generated/types/Button";

const PropsSchema = Type.Object(ButtonPropsSchema);
const StateSchema = Type.Object({});

const Button: ComponentImplementation<Static<typeof PropsSchema>> = (props) => {
  const { slotsMap, customStyle, callbackMap } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseButton
      className={css(customStyle?.content)}
      onClick={callbackMap?.onClick}
      {...cProps}
    >
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseButton>
  );
};

export default {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "button",
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [],
      slots: ["content"],
      styleSlots: ["content"],
      events: ["onClick"],
    },
  }),
  impl: Button,
};
