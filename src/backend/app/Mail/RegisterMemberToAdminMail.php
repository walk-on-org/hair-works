<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Member;
use App\Models\LpJobCategory;

class RegisterMemberToAdminMail extends Mailable
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
        $job_category = LpJobCategory::whereIn('id', array_column($this->member->lpJobCategories->toArray(), 'id'))
            ->pluck('name')
            ->join(';');

        return $this->to('entry-hair-works@walk-on.co.jp')
            ->subject('【HAIR WORKS】会員登録したユーザがいます')
            ->text('mail.RegisterMemberToAdminMail')
            ->with([
                'job_category' => $job_category,
                'change_time' => Member::CHANGE_TIME[$this->member->change_time],
                'register_site' => Member::REGISTER_SITE[$this->member->register_site],
            ]);
    }
}
