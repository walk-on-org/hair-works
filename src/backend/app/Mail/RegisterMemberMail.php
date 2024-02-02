<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegisterMemberMail extends Mailable
{
    use Queueable, SerializesModels;

    public $member;
    private $recommend_jobs;
    private $position_id;

    /**
     * Create a new message instance.
     */
    public function __construct($member, $recommend_jobs, $position_id)
    {
        $this->member = $member;
        $this->recommend_jobs = $recommend_jobs;
        $this->position_id = $position_id;
    }

    public function build()
    {
        $recommend_jobs_text = '';
        $host = config('app.front_url');
        if (count($this->recommend_jobs) > 0) {
            $recommend_jobs_text .= "\n◆あなたの希望条件にマッチした求人はこちら！";
            foreach ($this->recommend_jobs as $job) {
                $salary = '';
                if ($job->m_salary_lower) {
                    $salary = '月給：' . floor($job->m_salary_lower / 10000) . '万円〜';
                    if ($job->m_salary_upper) {
                        $salary .= floor($job->m_salary_upper / 10000) . '万円';
                    }
                } else if ($job->t_salary_lower) {
                    $salary = '時給：' . $job->t_salary_lower . '円〜';
                    if ($job->t_salary_upper) {
                        $salary .= $job->t_salary_upper . '円';
                    }
                } else if ($job->d_salary_lower) {
                    $salary = '日給：' . $job->d_salary_lower . '円〜';
                    if ($job->d_salary_upper) {
                        $salary .= $job->d_salary_upper . '円';
                    }
                } else if ($job->commission_lower) {
                    $salary = '歩合：' . $job->commission_lower . '%〜';
                    if ($job->commission_upper) {
                        $salary .= $job->commission_upper . '円';
                    }
                }
                $recommend_jobs_text .= <<<EOF

                ▼{$job->office_name}
                {$job->catch_copy}
                {$job->position_name}/{$job->employment_name}
                {$salary}
                {$host}/detail/{$job->job_id}?utm_source=member_complete_mail&utm_medium=mail&utm_campaign=recommend_job
                
                EOF;
            }
            $recommend_jobs_text .= "\nその他の求人を探すならこちらから\n{$host}/list/{$this->member->prefecture->permalink}?pos={$this->position_id}&emp={$this->member->employment_id}&utm_source=member_complete_mail&utm_medium=mail&utm_campaign=recommend_job";
        }
        return $this->to($this->member->email)
            ->subject('【HAIR WORKS】ご登録が完了いたしました')
            ->text('mail.RegisterMemberMail')
            ->with([
                'recommend_jobs_text' => $recommend_jobs_text,
            ]);
    }
}
