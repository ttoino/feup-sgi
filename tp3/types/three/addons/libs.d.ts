declare module "three/addons/libs/stats.module.js" {
    export default class Stats {
        constructor();

        dom: HTMLElement;
        domElement: typeof Stats.dom;

        addPanel(panel: Stats.Panel): Stats.Panel;

        showPanel(id: number): void;

        begin(): void;
        end(): number;
        update(): void;
    }

    namespace Stats {
        class Panel {
            constructor(name: string, fg: string, bg: string);

            dom: HTMLElement;
            update(value: number, maxValue: number): void;
        }
    }
}
