
import type { Category } from "@/types";

export interface MainGroup {
    id: string;
    title: string;
    image: string | null;
    subSections: {
        id: string;
        title: string;
        slug: string;
    }[];
}

export const CATEGORIES = {
    CROCHET_FLOWERS: {
        id: 1,
        name: "Crochet Flowers",
        slug: "crochet-flowers",
        count: 0,
    } as Category,
    CROCHET_BOUQUETS: {
        id: 2,
        name: "Crochet Bouquets",
        slug: "crochet-bouquets",
        count: 0,
    } as Category,
    PIPE_CLEANER_FLOWERS: {
        id: 3,
        name: "Pipe Cleaner Flowers",
        slug: "pipe-cleaner-flowers",
        count: 0,
    } as Category,
    PIPE_CLEANER_BOUQUETS: {
        id: 5,
        name: "Pipe Cleaner Bouquets",
        slug: "pipe-cleaner-bouquets",
        count: 0,
    } as Category,
    MOBILE_CASES: {
        id: 4,
        name: "Mobile Case",
        slug: "mobile-case",
        count: 0,
    } as Category,
};

export const MAIN_GROUPS: MainGroup[] = [
    {
        id: "crochet",
        title: "Crochet",
        image: "photo_3_2025-12-10_23-57-59.jpg", // Representing Crochet
        subSections: [
            { id: "crochet-flowers", title: "Flowers", slug: "crochet-flowers" },
            { id: "crochet-bouquets", title: "Bouquets", slug: "crochet-bouquets" }
        ]
    },
    {
        id: "pipe-cleaner",
        title: "Pipe Cleaner",
        image: "photo_3_2025-12-11_14-58-13.jpg", // Representing Pipe Cleaner
        subSections: [
            { id: "pipe-cleaner-flowers", title: "Flowers", slug: "pipe-cleaner-flowers" },
            { id: "pipe-cleaner-bouquets", title: "Bouquets", slug: "pipe-cleaner-bouquets" }
        ]
    },
    {
        id: "mobile-case",
        title: "Mobile Case",
        image: null, // Placeholder handled in UI
        subSections: [] // Special case
    }
];
