import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Project } from "../types";

export const loadProject = async (id: string): Promise<Project> => {
    const snapshot = await getDoc(doc(db, 'projects', id));
    if (snapshot.exists) {
        return snapshot.data() as Project;
    } else {
        throw ('Project ' + id + ' does not exist');
    }
}