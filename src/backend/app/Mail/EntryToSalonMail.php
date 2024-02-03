<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class EntryToSalonMail extends Mailable
{
    use Queueable, SerializesModels;

    public $applicant;
    public $office;
    public $job;
    public $to_mail;

    /**
     * Create a new message instance.
     */
    public function __construct($applicant, $office, $job, $to_mail)
    {
        $this->applicant = $applicant;
        $this->office = $office;
        $this->job = $job;
        $this->to_mail = $to_mail;
    }

    public function build()
    {
        // TODO Fromをentry-hair-works@walk-on.co.jp

        $now = Carbon::now()->timezone('Asia/Tokyo')
            ->format('Y年m月d日 H時i分');

        return $this->to($this->to_mail)
            ->bcc('info@walk-on.co.jp')
            ->subject('【HAIR WORKS】求職者からの応募がありました')
            ->text('mail.EntryToSalonMail')
            ->with([
                'now' => $now,
            ]);
    }
}
