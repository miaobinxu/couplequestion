// gender (gender could be male, female, other)
export const genderArray = ['Male', 'Female', 'Other'] as const;
export type Gender = typeof genderArray[number];

// age group (age group could be under 21, 21 to 30, 31 to 40, 41 to 50, 51 to 60, 61 or above)
export const ageGroupArray = [
    'Under 21',
    '21 to 30',
    '31 to 40',
    '41 to 50',
    '51 to 60',
    '61 or above',
] as const;
export type AgeGroup = typeof ageGroupArray[number];

// referral source (referral source could be instagram, facebook, tik-tok, youtube, google, tv, none of these)
export const referralSourceArray = [
    'Instagram',
    'Facebook',
    'TikTok',
    'YouTube',
    'Google',
    'TV',
    'None of these',
] as const;
export type ReferralSource = typeof referralSourceArray[number];

// skin type (skin type could be normal, dry, oily, combination, or i'm not sure)
export const skinTypeArray = [
    {
        label: 'Normal',
        description: 'Has barely visible pores, looks hydrated',
    },
    {
        label: 'Dry',
        description: 'Feels tight, might be flaky',
    },
    {
        label: 'Oily',
        description: 'Has large pores and an overall shine',
    },
    {
        label: 'Combination',
        description: 'Has an oily T-zone and dry or normal cheeks',
    },
    {
        label: "I'm not sure",
        description: "No worries! You'll find out with UpSkin face scan",
    },
] as const;
export type SkinType = (typeof skinTypeArray)[number]['label'];

export type RelationshipStatus = "relationship" | "engaged" | "civil_partnership" | "married";

// skin concern (skin concern could be a list of any one or more of the below mentioned skin concerns)
export const skinConcernArray = [
    'Acne',
    'Wrinkles',
    'Large pores',
    'Pigmentation',
    'Dry skin',
    'Redness',
] as const;
export type SkinConcern = typeof skinConcernArray[number][];

// skin goal (skin goal could be a list of any one or more of the below mentioned goals)
export const skinGoalArray = [
    'Reduce acne or post-acne',
    'Minimize wrinkles, improve skin firmness',
    'Minimize pores',
    'Get rid of pigmentation',
    'Make skin more hydrated',
    'Reduce redness and irritation',
] as const;;
export type SkinGoal = typeof skinGoalArray[number][];

// mapping of skin goal to key ingredients targeted for the user
export const ingredientMapping = {
    'Reduce acne or post-acne': ['Niacinamide', 'Aloe barbadensis', 'Calendula officinalis', 'Echinacea angustifolia'],
    'Minimize wrinkles, improve skin firmness': ['Peptides', 'Bakuchiol'],
    'Minimize pores': ['Niacinamide', 'Aloe barbadensis', 'Pisum sativum', 'Calendula officinalis'],
    'Get rid of pigmentation': ['Vitamin C', 'Niacinamide', 'Lactic acid'],
    'Make skin more hydrated': ['Hyaluronic acid', 'Phospholipids', 'Amino acids', 'Aloe barbadensis'],
    'Reduce redness and irritation': ['Emollients', 'Vitamin C']
};

// ranking/priority of key ingredients
export const priorityRanking = {
    'Niacinamide': 1,
    'Emollients': 2,
    'Vitamin C': 3,
    'Peptides': 4,
    'Hyaluronic acid': 5,
    'Aloe barbadensis': 6,
    'Bakuchiol': 7,
    'Phospholipids': 8,
    'Calendula officinalis': 9,
    'Lactic acid': 10,
    'Pisum sativum': 11,
    'Amino acids': 12,
    'Echinacea angustifolia': 13
};

export const reachGoalsSteps = [
    "Use a gentle cleanser twice a day - once in the morning and once at night.",
    "Apply a hydrating toner or essence after cleansing.",
    "Limit sugar, greasy foods, and dairy.",
    "Avoid touching your face, using harsh scrubs, or picking at your skin.",
    "Wear sunscreen when out in the sun."
];

// final onboarding interface comprising all the above data
export interface Onboarding {
    gender: Gender | '';
    ageGroup?: AgeGroup | '';
    referralSource: ReferralSource | '';
    skinType?: SkinType | '';
    skinConcern?: SkinConcern;
    skinGoal?: SkinGoal;
    referralCode?: string;
    // Profile data fields
    name?: string;
    birthDate?: Date;
    birthLocation?: string;
    birthTime?: Date;
    relationshipDuration?: Date;
    relationshipStatus: RelationshipStatus;
    relationshipGoals?: string[];
}
