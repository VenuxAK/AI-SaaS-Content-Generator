<?php

namespace App\Enums;

enum ContentType: string
{
    case FacebookPost = 'facebook_post';
    case TikTokScript = 'tiktok_script';
    case MarketingCopy = 'marketing_copy';
    case Caption = 'caption';
    case BlogPost = 'blog_post';
    case LinkedInPost = 'linkedin_post';
    case TwitterThread = 'twitter_thread';
    case AdCopy = 'ad_copy';
    case ColdEmail = 'cold_email';
    case CarouselSlides = 'carousel_slides';
    case YouTubeScript = 'youtube_script';

    public function label(): string
    {
        return match ($this) {
            self::FacebookPost => 'Facebook Post',
            self::TikTokScript => 'TikTok Script',
            self::MarketingCopy => 'Marketing Copy',
            self::Caption => 'Caption',
            self::BlogPost => 'Blog Post',
            self::LinkedInPost => 'LinkedIn Post',
            self::TwitterThread => 'Twitter / X Thread',
            self::AdCopy => 'Ad Copy (Google & Meta)',
            self::ColdEmail => 'Cold Email / Outreach',
            self::CarouselSlides => 'Carousel Slides (IG / LinkedIn)',
            self::YouTubeScript => 'YouTube Script & Description',
        };
    }

    public function promptFile(): string
    {
        return match ($this) {
            self::FacebookPost => 'facebook_post.md',
            self::TikTokScript => 'tiktok_script.md',
            self::MarketingCopy => 'marketing_copy.md',
            self::Caption => 'caption.md',
            self::BlogPost => 'blog_post.md',
            self::LinkedInPost => 'linkedin_post.md',
            self::TwitterThread => 'twitter_thread.md',
            self::AdCopy => 'ad_copy.md',
            self::ColdEmail => 'cold_email.md',
            self::CarouselSlides => 'carousel_slides.md',
            self::YouTubeScript => 'youtube_script.md',
        };
    }
}
