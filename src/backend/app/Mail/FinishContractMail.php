<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FinishContractMail extends Mailable
{
    use Queueable, SerializesModels;

    public $corporations;

    /**
     * Create a new message instance.
     */
    public function __construct($corporations)
    {
        $this->corporations = $corporations;
    }

    public function build()
    {
        return $this->to('info@walk-on.co.jp')
            ->subject('【HAIR WORKS】契約終了間近な求人があります')
            ->text('mail.BeforeFinishContractMail');
    }
}
