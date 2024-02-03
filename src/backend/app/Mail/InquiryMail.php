<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Inquiry;

class InquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public $inquiry;
    public $to_mail;

    /**
     * Create a new message instance.
     */
    public function __construct($inquiry, $to_mail)
    {
        $this->inquiry = $inquiry;
        $this->to_mail = $to_mail;
    }

    public function build()
    {
        $smoothly_url = '';
        if (in_array($this->inquiry->prefecture_id, [23, 27, 28])) {
            // 愛知、大阪、兵庫は前田さん
            $smoothly_url = 'https://smoothly.jp/schedule-adjustment/many?event_code=i5WPJULb&user_code=takeshi-maeda-4810';
        } else if (in_array($this->inquiry->prefecture_id, [11, 12, 14, 40])) {
            // 千葉、埼玉、神奈川、福岡は小山さん
            $smoothly_url = 'https://smoothly.jp/schedule-adjustment/many?event_code=R8SG3qB3&user_code=walk-on-koyama';
        } else {
            // 上記以外は立崎さん
            $smoothly_url = 'https://smoothly.jp/schedule-adjustment/many?event_code=P14V1zfl&user_code=masahiro-tatsuzaki-1931';
        }

        return $this->to($this->to_mail)
            ->subject('【HAIR WORKS】お問い合わせありがとうございます')
            ->text('mail.InquiryMail')
            ->with([
                'inquiry_type' => Inquiry::INQUIRY_TYPE[$this->inquiry->inquiry_type],
                'smoothly_url' => $smoothly_url,
            ]);
    }
}
