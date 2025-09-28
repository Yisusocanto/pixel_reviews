import type { User } from "@/types/userTypes";

export interface Game {
    game_id: number
    title: string
    slug: string
    releaseDate: string
    imageURL: string
    description: string
    developers?: Array<Developer>;
    publishers?: Array<Publisher>;
    rating?: Array<Rating>;
    review?: Array<Rating>;
}

export interface SearchedGame {
    title: string;
    slug: string;
    releaseDate: string;
    imageURL: string; 
}

export interface Developer {
    developer_id: number;
    name: string;
    slug: string;
    games?: Array<Game>
}

export interface Publisher {
    publisher_id: number;
    name: string;
    slug: string;
    games?: Array<Game>
}

export interface Rating {
    rating_id: number;
    score: string;
    createdAt: string;
    game?: Game;
    author?: User;
}

export interface Review {
    review_id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    game?: Game;
    author?: User;
}
