import { ComponentSchema } from '@sunmao-ui/core';
import { BaseLeafOperation } from '../../type';
import _ from 'lodash-es';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';
export type ModifyComponentPropertiesLeafOperationContext = {
  componentId: string;
  properties: Record<string, any | (<T = any>(prev: T) => T)>;
};

export class ModifyComponentPropertiesLeafOperation extends BaseLeafOperation<ModifyComponentPropertiesLeafOperationContext> {
  private previousState: Record<string, any> = {};
  do(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (component) {
      for (const property in this.context.properties) {
        const oldValue = component.rawProperties[property];
        // assign previous data
        this.previousState[property] = oldValue;
        let newValue = this.context.properties[property];
        if (_.isFunction(newValue)) {
          // if modified value is a lazy function, execute it and assign
          newValue = newValue(_.cloneDeep(oldValue));
        }
        component.updateComponentProperty(property, newValue);
        this.context.properties[property] = newValue;
      }
    } else {
      console.warn('component not found');
      return prev;
    }

    const newSchema = appModel.toSchema();
    return newSchema;
  }
  redo(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    for (const property in this.context.properties) {
      component.updateComponentProperty(property, this.context.properties[property]);
    }
    return appModel.toSchema();
  }
  undo(prev: ComponentSchema[]): ComponentSchema[] {
    const appModel = new AppModel(prev);
    const component = appModel.getComponentById(this.context.componentId as ComponentId);
    if (!component) {
      console.warn('component not found');
      return prev;
    }

    for (const property in this.previousState) {
      component.updateComponentProperty(property, this.previousState[property]);
    }

    return appModel.toSchema();
  }
}
