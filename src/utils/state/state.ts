import { writable } from "svelte/store"

// open editors
export const tabs = writable<string[]>([])
export const selectedTab = writable<string>()

/**
 * Select the tab with the provided name, if it exists.
 * @param path The name of the tab to select.
 */
const selectTab = (path: string):void => {
    tabs.subscribe(tabs => {
        if(tabs.includes(path)) {
            selectedTab.set(path)
        }
    })
    
}

/**
 * Create a new tab if it doesn't exist and select it.
 * @param path The path to the file for this tab.
 */
export const openTab = (path: string):void => {
    tabs.update((tabs) => {
        if(tabs.includes(path)) {
            return tabs
        }
        return [...tabs, path]
    })
    // Select the newly created tab
    selectTab(path)
}

/**
 * Update all tabs that are files in some parent directory by renaming
 * the parent directory.
 * 
 * @param oldDir The directory name to search for.
 * @param newDir What the directory name should be replaced with.
 */
export const renameTabs = (oldDir: string, newDir: string):void => {
    tabs.update(tabs => tabs.map(path => path.startsWith(oldDir) ? path.replace(oldDir, newDir) : path))
    selectedTab.update(path => path.startsWith(oldDir) ? path.replace(oldDir, newDir) : path)
}

/**
 * Rename a tab exactly matching the given name.
 * @param oldName The name to replace.
 * @param newName The new name to use.
 */
export const renameTab = (oldName: string, newName: string):void => {
    tabs.update((tabs) => {
        if(tabs.includes(oldName)) {
            tabs[tabs.indexOf(oldName)] = newName
        }
        return tabs
    })
    selectedTab.update(path => path === oldName ? newName : path)
}

/**
 * Closes a tab.
 * @param name The name of the tab to close.
 */
export const closeTab = (name:string):void => {
    tabs.update((tabs) => {
        if(tabs.includes(name)) {
            tabs.splice(tabs.indexOf(name), 1)
        }
        return tabs
    })
}

/**
 * Close all tabs that are files in some parent directory.
 * @param parent The name of the directory.
 */
export const closeTabs = (parent:string):void => {
    tabs.update((tabs) => tabs.filter(path => !path.startsWith(parent)))
}