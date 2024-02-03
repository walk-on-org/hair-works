{{ $office->name }}{{ $job->private ? '(非公開求人)' : '' }}
採用ご担当者様

求職者より応募がありましたので、ご対応をよろしくお願い致します。
詳細情報は管理サイトの応募者一覧ページから情報確認できます。
https://hair-work.jp/admin/applicants
{{ $job->recommend ? '※オススメ求人（人材紹介）の求人への応募になりますので、求職者へのご連絡をお願い致します。' : '' }}

■応募日時：{{ $now }}
■求人情報
求人名：{{ $job->name }}{{ $job->private ? '(非公開求人)' : '' }}
職種：{{ $job->jobCategory->name }}
役職/役割：{{ $job->position->name }}
雇用形態：{{ $job->employment->name }}

管理サイトのパスワードを忘れた場合は下記リンクからパスワードの再設定をお願い致します。
https://hair-work.jp/admin/password/new

--------------------------------
HAIRWORKSサポート
 [mail]info@walk-on.co.jp

『働くを近くに』HAIRWORKS
 [URL]https://hair-work.jp
--------------------------------