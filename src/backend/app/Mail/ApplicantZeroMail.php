<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicantZeroMail extends Mailable
{
    use Queueable, SerializesModels;

    private $first_contract_one_month_corporations;
    private $first_contract_two_month_corporations;
    private $continuation_contract_two_month_corporations;

    /**
     * Create a new message instance.
     */
    public function __construct(
        $first_contract_one_month_corporations,
        $first_contract_two_month_corporations,
        $continuation_contract_two_month_corporations
    )
    {
        $this->first_contract_one_month_corporations = $first_contract_one_month_corporations;
        $this->first_contract_two_month_corporations = $first_contract_two_month_corporations;
        $this->continuation_contract_two_month_corporations = $continuation_contract_two_month_corporations;
    }

    public function build()
    {
        return $this->to('info@walk-on.co.jp')
            ->subject('【HAIR WORKS】契約後応募がない法人お知らせ')
            ->text('mail.ApplicantZeroMail');
    }
}
