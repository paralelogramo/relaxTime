export class Song {
    title: string;
    album?: string;
    artist: string;
    duration: string;
    started_at: Date;
    ends_at: Date;

    constructor(
        title: string,
        artist: string,
        duration: number,
        started_at: Date,
        ends_at: Date,
        album?: string
    ) {
        this.title = title;
        this.artist = artist;
        this.duration = this.getMinutesSeconds(duration);
        this.started_at = started_at;
        this.ends_at = ends_at;
        this.album = album;
    }

    getMinutesSeconds(duration: number): string {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    getNumberDuration(): number {
        const parts = this.duration.split(':');
        if (parts.length !== 2) return 0; // Invalid format
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        return minutes * 60 + seconds;
    }
}