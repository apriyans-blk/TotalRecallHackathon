# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Video.create(
    title: 'Ted Talk 1: ',
    transcript: 'transcript_1.json',
    s3url: 'https://console.aws.amazon.com/s3/buckets/hack2020-dont-delete/video1/?region=ap-south-1&tab=overview',
    folder_path: 'app/assets/transcripts',
    created_at: '2020-05-08 09:11:03',
    updated_at: '2020-05-08 09:11:03'
)

Video.create(
    title: 'Ted Talk 2: ',
    transcript: 'transcript_2.json',
    s3url: 'https://console.aws.amazon.com/s3/buckets/hack2020-dont-delete/video2/?region=ap-south-1&tab=overview',
    folder_path: 'app/assets/transcripts',
    created_at: '2020-05-08 09:12:03',
    updated_at: '2020-05-08 09:12:03'
)

Video.create(
    title: 'Ted Talk 3: ',
    transcript: 'transcript_3.json',
    s3url: 'https://console.aws.amazon.com/s3/buckets/hack2020-dont-delete/video3/?region=ap-south-1&tab=overview',
    folder_path: 'app/assets/transcripts',
    created_at: '2020-05-08 09:13:03',
    updated_at: '2020-05-08 09:13:03'
)