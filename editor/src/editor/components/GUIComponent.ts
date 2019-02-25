namespace paper.editor {
    /**
     * 
     */
    export type QuaryValues = {
        FPS?: 0 | 1,
        GUI?: 0 | 1,
        DEBUG?: 0 | 1,
    };
    /**
     * 
     */
    export const enum ShowState {
        None = 0b000,

        FPS = 0b001,
        Hierarchy = 0b010,
        Inspector = 0b100,

        HierarchyAndInspector = Hierarchy | Inspector,
        All = FPS | Hierarchy | Inspector,
    }
    /**
     * 
     */
    @singleton
    export class GUIComponent extends BaseComponent {

        public showStates: ShowState = ShowState.None;
        public quaryValues: QuaryValues = {};
        public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly stats: Stats = new Stats();
        public readonly renderPanel: Stats.Panel = this.stats.addPanel(new Stats.Panel("MS(R)", "#ff8", "#221"));
        /**
         * @internal
         */
        public readonly hierarchyItems: { [key: string]: dat.GUI } = {};
        /**
         * @internal
         */
        public readonly inspectorItems: { [key: string]: dat.GUI } = {};

        private readonly _lastSelectedGroup: Group<GameObject> = Application.gameObjectContext.getGroup(
            Matcher.create<GameObject>(false, egret3d.Transform, LastSelectedFlag)
        );

        public initialize() {
            super.initialize();

            this.stats.showPanel(0);
        }

        public openComponents(...args: IComponentClass<IComponent>[]) {
            const lastSelectedEntity = this._lastSelectedGroup.singleEntity;
            if (!lastSelectedEntity) {
                return;
            }

            for (const k in this.inspectorItems) {
                this.inspectorItems[k].close();
            }

            for (const componentClass of args) {
                const component = lastSelectedEntity.getComponent(componentClass);
                if (component && component.uuid in this.inspectorItems) {
                    this.inspectorItems[component.uuid].open();
                }
            }
        }
    }
}
