import { ApplicationComponent } from '@sunmao-ui/core';
import { eventBus } from '../eventBus';
import { Application } from '@sunmao-ui/core';
import { IUndoRedoManager, IOperation, OperationList } from './type';

export class AppModelManager implements IUndoRedoManager {
  components: ApplicationComponent[] = [];
  operationStack: OperationList<IOperation> = new OperationList();
  private _app: Application;
  public get app(): Application {
    return this._app;
  }
  constructor(app: Application, components: ApplicationComponent[]) {
    this._app = app;
    this.components = components;
    this.updateApp(app);
    eventBus.on('undo', () => this.undo());
    eventBus.on('redo', () => this.redo());
    eventBus.on('operation', o => this.do(o));
    eventBus.on('componentsReload', components => {
      console.log('componentsReload', components);
      this.updateComponents(components);
    });
  }

  updateComponents(components: ApplicationComponent[]) {
    this.components = components;
    eventBus.send('componentsChange', this.components);
  }

  do(operation: IOperation): void {
    // TODO: replace by logger
    // console.log('do', operation);
    const newApp = operation.do(this._app);
    this.operationStack.insert(operation);
    this.updateApp(newApp);
  }

  redo(): void {
    if (!this.operationStack.cursor.next) {
      return;
    }
    try {
      this.operationStack.moveNext();
    } catch {
      console.warn('cannot redo as cannot move to next cursor', this.operationStack);
      return;
    }
    const newApp = this.operationStack.cursor?.val?.redo(this._app);
    // console.log('redo', this.operationStack.cursor?.val);
    if (newApp) {
      this.updateApp(newApp);
    } else {
      // rollback move next
      this.operationStack.movePrev();
      console.warn('cannot redo as next cursor has no operation', this.operationStack);
    }
  }

  undo(): void {
    if (!this.operationStack.cursor.prev) {
      return;
    }
    try {
      this.operationStack.movePrev();
    } catch {
      console.warn('cannot undo as cannot move to prev cursor', this.operationStack);
      return;
    }
    const newApp = this.operationStack.cursor.next?.val?.undo(this._app);
    // console.log('undo', this.operationStack.cursor.next?.val);
    if (newApp) {
      this.updateApp(newApp);
    } else {
      //rollback move prev
      this.operationStack.moveNext();
      console.warn('cannot undo as cursor has no operation', this.operationStack);
    }
  }

  updateApp(app: Application) {
    eventBus.send('appChange', app);
    localStorage.setItem('schema', JSON.stringify(app));
    this._app = app;
  }
}
