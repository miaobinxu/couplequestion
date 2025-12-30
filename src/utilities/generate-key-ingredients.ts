import { SkinGoal, ingredientMapping, priorityRanking } from '@blue-prints/global-store/onboarding/onboarding';

export const generateKeyIngredients = (skinGoal: SkinGoal) => {
    // generate all key ingredients based on selected skin goal(s)
    let keyIngredients: string[] = [];
    skinGoal.forEach(goal => {
        if (ingredientMapping[goal]) {
            keyIngredients = keyIngredients.concat(ingredientMapping[goal]);
        }
    });
    // remove duplicates
    const uniqueIngredients: string[] = [...new Set(keyIngredients)];
    // sort by priority ranking
    uniqueIngredients.sort((a, b) => priorityRanking[a as keyof typeof priorityRanking] - priorityRanking[b as keyof typeof priorityRanking]);
    // return top 4 ingredients (or fewer if less are available)
    return uniqueIngredients.slice(0, 4);
}