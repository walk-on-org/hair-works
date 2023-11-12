# 開発手順

## 開発環境立ち上げ

- Docker 起動

  ```
  docker-compose up -d --build
  ```

- MySQL のマイグレーション

  ```
  # PHPサーバーに入る
  docker compose exec php bash
  # マイグレーション実行
  php artisan migrate
  ```

- clone 後に Docker が起動しない、エラーになる場合

  - php

    - 以下のエラーが発生した場合

      - Fatal error: Uncaught Error: Failed opening required '/var/www/html/public/../vendor/autoload.php' (include_path='.:/usr/local/lib/php') in /var/www/html/public/index.php:34 Stack trace: #0 {main} thrown in /var/www/html/public/index.php on line 34

    - 以下を php の docker に入って実行する

  ```
  docker-compose exec php bash # php用のコンテナを用意していたため
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php -r "if (hash_file('sha384', 'composer-setup.php') === '906a84df04cea2aa72f40b5f787e49f22d4c2f19492ac310e8cba5b96ac8b64115ac402c8cd292b8a03482574915d1a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
  php composer-setup.php
  php -r "unlink('composer-setup.php');"
  mv composer.phar /usr/local/bin/composer
  composer -V
  composer install
  ```

  - node
    - 以下のエラーが発生した場合
      - sh: 1: next: not found
    - 以下コマンドを実行する
      `docker-compose run -w /app --rm node npm install`

## データベース変更

1. Docker コンテナに入り、migration ファイルを作成するコマンドを実行

```

php artisan make:migration create_job_categories_table --create=job_categories

```

2. 作成された migration ファイルにテーブル項目を記載する
3. migration ファイルを実行

```

php artisan migrate

```

4. Model を作成するために、以下のコマンドを実行

```

php artisan make:model JobCategory

```

5. Model には以下のように変更可能な項目を記載

```

// fillable に指定したプロパティは入力可能になる
protected $fillable = [
'name',
'permalink',
'status',
];

```

6. routes/api.php にルーティングを追加
7. API の Controller を作成するために以下のコマンドを実行

```

php artisan make:controller JobCategoryController --model=JobCategory

```

## フロントエンドの注意点

- API 連携
- クライアントでの API 接続については、apiClient を使用すること
- サーバ上での API 接続については、apiServer を使用すること

```

```
