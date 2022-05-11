import {db} from "../config";
import {firestore} from "firebase-admin";
import WhereFilterOp = firestore.WhereFilterOp;

type Where = {
    field: string
    operator: WhereFilterOp
    to: any
}

export const getFirestoreData = async<T>(collectionString: string, wheres: Where[]): Promise<T> => {
    const ref = db.collection(collectionString)
    wheres.forEach(w => ref.where(w.field, w.operator, w.to))
    const res = await ref.get()
    return res.docs.map(d => d.data()) as unknown as T
}