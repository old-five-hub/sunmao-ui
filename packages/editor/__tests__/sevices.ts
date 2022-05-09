import { initSunmaoUIEditor } from '../src';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';
export const { registry } = initSunmaoUIEditor({
  runtimeProps: { libs: [sunmaoChakraUILib] },
});
