{{ $corporation->name }}
採用ご担当者様

お世話になっております。
HAIRWORKS  制作担当の中野でございます。
この度はご掲載依頼を頂き、ありがとうございます。
HAIRWORKSの求人ページの制作が完了しましたのでご連絡致しました。

お手数をおかけしますが、下記URLより求人内容のご確認をお願い致します。
※求人はまだ公開されておりません。

■求人情報
@foreach ($jobs as $job)
求人名：{{ $job->name }}
職種：{{ $job->job_category_name }}
役職/役割：{{ $job->position_name }}
雇用形態：{{ $job->employment_name }}
https://hair-work.jp/detailpreview/{{ $job->enc_id }}

@endforeach
修正などございましたらお気軽にお申し付け下さい。
内容に相違がなければ一言で構いませんので
【求人内容OK】とご返信をお願い致します。

ご返信のない際は、恐れ入りますが
本日から7営業日経過後、自動的にご掲載を
スタートさせていただきます。
※ご掲載後に修正も可能でございます。

どうぞよろしくお願い致します。
