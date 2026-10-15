<?php

namespace App\Enums;

enum OutputLanguage: string
{
    case English = 'en';
    case Burmese = 'my';

    public function label(): string
    {
        return match ($this) {
            self::English => 'English',
            self::Burmese => 'Burmese (Myanmar)',
        };
    }

    public function instruction(): string
    {
        return match ($this) {
            self::English => 'Write the entire content in English. Ensure natural, engaging, native-level fluency.',
            self::Burmese => <<<'BURMESE'
Write the entire content in Burmese (Myanmar language, Unicode script).
CRITICAL BURMESE WRITING & LOCALIZATION RULES:
1. STRICTLY NO LITERAL TRANSLATIONS: Do NOT translate English idioms, metaphors, or expressions word-for-word. (For example, never translate "where productivity goes to die" literally as "လူသတ်တဲ့ သုသာန်"; translate the conceptual meaning naturally, e.g. "အချိန်တွေ အလဟဿကုန်ပြီး လုပ်ငန်းမတွင်ကျယ်စေတဲ့ နေရာ").
2. RESPECTFUL & PROFESSIONAL PRONOUNS: Use professional, relatable, and respectful Burmese pronouns (use "ကျွန်တော်တို့ / မိမိတို့" or refer to the product/brand by name). NEVER use crude, harsh, or overly informal pronouns like "ငါ" or "ငါတို့" for brand or business content.
3. TECH & BRAND PRESERVATION: Keep well-known tech terms, brand names, and software in English or standard familiar usage (e.g., "Jira", "ClickUp", "AI", "Startup", "Beta", "Dashboard", "Standup", "Zero-click"). Do not invent confusing literal Burmese coinages for established software terms.
4. NATURAL NATIVE CADENCE: Write like an experienced, native Burmese digital marketer. Use smooth, modern colloquial Burmese grammar with natural sentence endings (e.g., "...ပါ", "...ကြစို့", "...နိုင်ပါပြီ", "...မလား") rather than stiff, textbook, or robotic machine-translated phrasing.
BURMESE,
        };
    }
}
