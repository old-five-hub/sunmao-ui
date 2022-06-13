import {
  ComponentSchema,
  TraitSchema,
  MethodSchema,
  RuntimeTrait,
} from '@sunmao-ui/core';
import { Emitter } from 'mitt';
import { Node } from 'acorn';

export type ComponentId = string & {
  kind: 'componentId';
};
export type TraitId = string & {
  kind: 'traitId';
};
export type ComponentType = string & {
  kind: 'componentType';
};
export type ModuleId = string & {
  kind: 'moduleId';
};
export type ModuleType = string & {
  kind: 'moduleType';
};
export type TraitType = string & {
  kind: 'traitType';
};
export type SlotName = string & {
  kind: 'slotName';
};
export type MethodName = string & {
  kind: 'methodName';
};
export type StyleSlotName = string & {
  kind: 'styleSlotName';
};
export type EventName = string & {
  kind: 'eventName';
};

export type AppModelEventType = {
  idChange: { oldId: ComponentId; newId: ComponentId };
};

export interface IAppModel {
  emitter: Emitter<AppModelEventType>;
  topComponents: IComponentModel[];
  // modules: IModuleModel[];
  moduleIds: ModuleId[];
  // generated by traverse the tree. Component will be overwritten if its id is duplicated.
  allComponents: IComponentModel[];
  // all components, including orphan component
  allComponentsWithOrphan: IComponentModel[];
  toSchema(): ComponentSchema[];
  genId(type: ComponentType): ComponentId;
  createComponent(type: ComponentType, id?: ComponentId): IComponentModel;
  getComponentById(id: ComponentId): IComponentModel | undefined;
  removeComponent(componentId: ComponentId): void;
  appendChild(component: IComponentModel): void;
  changeComponentMapId(oldId: ComponentId, newId: ComponentId): void;
  _bindComponentToModel(component: IComponentModel): void;
}

export interface IModuleModel {
  id: ModuleId;
  type: ModuleType;
  property: Record<string, IFieldModel>;
}

export interface IComponentModel {
  appModel: IAppModel;
  id: ComponentId;
  type: ComponentType;
  properties: IFieldModel;
  // just like properties in schema
  rawProperties: Record<string, any>;
  children: Record<SlotName, IComponentModel[]>;
  parent: IComponentModel | null;
  parentId: ComponentId | null;
  parentSlot: SlotName | null;
  traits: ITraitModel[];
  slots: SlotName[];
  styleSlots: StyleSlotName[];
  // fake data generated by the stateSpecs of component and its traits.
  // for validator to validate expression
  stateExample: Record<string, any>;
  // both component's methods and traits' methods
  methods: MethodSchema[];
  events: EventName[];
  // all children of this component
  allComponents: IComponentModel[];
  nextSibling: IComponentModel | null;
  prevSibling: IComponentModel | null;
  _isDirty: boolean;
  _slotTrait: ITraitModel | null;
  toSchema(): ComponentSchema;
  updateComponentProperty: (property: string, value: unknown) => void;
  // move component from old parent to new parent(or top level if parent is undefined).
  appendTo: (parent?: IComponentModel, slot?: SlotName) => void;
  // move component to the behind of another component in same level
  moveAfter: (after: IComponentModel | null) => IComponentModel;
  // append other component as child of this component
  appendChild: (component: IComponentModel, slot: SlotName) => void;
  changeId: (newId: ComponentId) => IComponentModel;
  addTrait: (traitType: TraitType, properties: Record<string, unknown>) => ITraitModel;
  removeTrait: (traitId: TraitId) => void;
  updateTraitProperties: (traitId: TraitId, properties: Record<string, unknown>) => void;
  updateSlotTrait: (parent: ComponentId, slot: SlotName) => void;
  removeChild: (child: IComponentModel) => void;
}

export interface ITraitModel {
  // trait id only exists in model, doesn't exist in schema
  appModel: IAppModel;
  spec: RuntimeTrait;
  id: TraitId;
  parent: IComponentModel;
  type: TraitType;
  rawProperties: Record<string, any>;
  properties: IFieldModel;
  methods: MethodSchema[];
  _isDirty: boolean;
  toSchema(): TraitSchema;
  updateProperty: (key: string, value: any) => void;
}

export type RefInfo = {
  nodes: (Node & { name: string })[];
  properties: string[];
};

export interface IFieldModel {
  // value: any;
  appModel?: IAppModel;
  componentModel?: IComponentModel;
  isDynamic: boolean;
  rawValue: any;
  update: (value: unknown) => void;
  getProperty: (key: string) => IFieldModel | void;
  getValue: () => unknown | void | IFieldModel;
  traverse: (cb: (f: IFieldModel, key: string) => void) => void;
  onReferenceIdChange: (params: AppModelEventType['idChange']) => void;
  // ids of used components in the expression
  refs: Record<ComponentId | ModuleId, RefInfo>;
}
