<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegisterAgentMemberMail extends Mailable
{
    use Queueable, SerializesModels;
    
    public $member;

    /**
     * Create a new message instance.
     */
    public function __construct($member)
    {
        $this->member = $member;
    }

    public function build()
    {
        return $this->to($this->member->email)
            ->subject('【HAIR WORKSエージェント】ご登録が完了いたしました')
            ->text('mail.RegisterAgentMemberMail');
    }
}
