import {ray} from "node-ray/web";
import ArrayUtils from "@/Utils/ArrayUtils";

export default class ShoppingListUtils {

    static sortAndPrepareShoppingList(shoppingList) {

        let shoppingListToReturn = [];

        if(!shoppingList) return [];

        //ray clear session
        ray().clearScreen();

        let {type, entries} = shoppingList;
        if(type === 'default'){
            shoppingListToReturn = [
                ...entries.filter(entry => !entry.checked).map(entry => {
                    return {
                        type: 'entry',
                        ...entry
                    }
                }),
                ...entries.filter(entry => entry.checked).map(entry => {
                    return {
                        type: 'entry',
                        ...entry
                    }
                })
            ];
        } else if(type === 'grouped'){

            Object.entries(ArrayUtils.
            groupBy(entries
                .filter(entry => !entry.checked),'category'))
                .map(([key,entries]) => {
                    shoppingListToReturn = [...shoppingListToReturn,
                        {
                            type: 'category',
                            category: key
                        },
                        ...entries.map(entry => {
                            return {
                                type: 'entry',
                                ...entry
                            }
                        })
                    ];
                });
            if(entries.filter(entry => entry.checked).length > 0){
                shoppingListToReturn = [...shoppingListToReturn,
                    {
                        type: 'category',
                        category: 'Zaznaczone'
                    },
                    ...entries.filter(entry => entry.checked).map(entry => {
                        return {
                            type: 'entry',
                            ...entry
                        }
                    })
                ];
            }
        }

        return shoppingListToReturn;

    }

}