<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BeforeFinishContractMail extends Mailable
{
    use Queueable, SerializesModels;

    public $finish_corporations;
    public $continue_corporations;

    /**
     * Create a new message instance.
     */
    public function __construct($finish_corporations, $continue_corporations)
    {
        $this->finish_corporations = $finish_corporations;
        $this->continue_corporations = $continue_corporations;
    }

    public function build()
    {
        return $this->to('info@walk-on.co.jp')
            ->subject('【HAIR WORKS】契約終了した求人を掲載停止しました')
            ->text('mail.FinishContractMail');
    }
}
