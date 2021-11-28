
export interface TagCache {
    path: string;
    name: string;
    meta: { title: string; show: boolean };
    closable: boolean;
    state: boolean;
}

export interface TableHeader {
    prop: string,
    type: string,
    label: string,
}

export enum ToolbarEvent {
    Add = 0,
    Upload,
    Download,
    Delete,
    Setting,
    Refresh,
    Fields,
    Charts,
}
