<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public $jobs;
    public $corporation;
    public $to_mail;

    /**
     * Create a new message instance.
     */
    public function __construct($jobs, $corporation, $to_mail)
    {
        $this->jobs = $jobs;
        $this->corporation = $corporation;
        $this->to_mail = $to_mail;
    }

    public function build()
    {
        return $this->to('info@walk-on.co.jp')
            ->subject('【HAIR WORKS】求人の承認ご依頼')
            ->text('mail.ApprovalMail');
    }
}
