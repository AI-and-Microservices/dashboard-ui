
export type FileData = {
    file: File;
    name: string;
    size: number;
    type: string;
};

export type Attachment = {
    _id: string;
    url: string;
    type: string;
    mimeType: string;
    name: string;
    size: number;
    thumbnailUrl: string;
}

export type Message = {
    _id: string;
    conversationId: string;
    senderType: string;
    senderId: string;
    content: string;
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
}