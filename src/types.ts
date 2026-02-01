// Drama Types
export interface Drama {
    bookId: string;
    bookName: string;
    coverWap?: string;
    cover?: string;
    chapterCount?: number;
    introduction: string;
    tags?: string[];
    tagNames?: string[];
    tagV3s?: TagV3[];
    playCount?: string;
    protagonist?: string;
    corner?: Corner;
    rankVo?: RankVo;
    shelfTime?: string;
    inLibrary?: boolean;
}

export interface TagV3 {
    tagId: number;
    tagName: string;
    tagEnName: string;
}

export interface Corner {
    cornerType: number;
    name: string;
    color: string;
}

export interface RankVo {
    rankType: number;
    hotCode: string;
    recCopy?: string;
    sort: number;
}

// Episode Types
export interface Episode {
    chapterId: string;
    chapterIndex: number;
    isCharge: number;
    chapterName: string;
    cdnList: CdnList[];
    chapterImg: string;
    chapterType: number;
    chargeChapter: boolean;
}

export interface CdnList {
    cdnDomain: string;
    isDefault: number;
    videoPathList: VideoPath[];
}

export interface VideoPath {
    quality: number;
    videoPath: string;
    isDefault: number;
    isEntry: number;
    isVipEquity: number;
}

// API Response Types
export interface ApiResponse<T> {
    status: boolean;
    creator?: string;
    data: T;
}

// Search Keyword
export interface SearchKeyword {
    keyword: string;
    count?: number;
}
