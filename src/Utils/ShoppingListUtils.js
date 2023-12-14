import {ray} from "node-ray/web";
import ArrayUtils from "@/Utils/ArrayUtils";
import store from "@/Store/store";

export default class ShoppingListUtils {

    static sortAndPrepareShoppingList(shoppingList) {

        let shoppingListToReturn = [];

        if(!shoppingList) return [];

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

            let categories = entries.map(entry =>
                entry.product_category && {
                id: entry.product_category.id,
                name: entry.product_category.name
                    }
            );

            categories = [...new Set(categories.filter(category => category))];

            Object.entries(ArrayUtils.
            groupBy(entries
                .filter(entry => !entry.checked),'category_id'))
                .map(([key,entries]) => {
                    let category = 'undefined'
                    if(key != 'null') {
                        console.log('KEY:',key);
                        category = categories.find(category => category.id == parseInt(key)).name;
                    }


                    shoppingListToReturn = [...shoppingListToReturn,
                        {
                            type: 'category',
                            category: category
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