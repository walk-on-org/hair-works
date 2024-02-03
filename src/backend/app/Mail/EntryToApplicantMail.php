<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EntryToApplicantMail extends Mailable
{
    use Queueable, SerializesModels;

    public $applicant;
    public $office;
    public $job;

    /**
     * Create a new message instance.
     */
    public function __construct($applicant, $office, $job)
    {
        $this->applicant = $applicant;
        $this->office = $office;
        $this->job = $job;
    }

    public function build()
    {
        // TODO Fromをentry-hair-works@walk-on.co.jp
        return $this->to($this->applicant->mail)
            ->subject('【応募完了】' . ($this->job->private ? '非公開求人' : $this->office->name) . '[By HairWokrs]')
            ->text('mail.EntryToApplicantMail');
    }
}
