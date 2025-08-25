-- Insert sample books
INSERT INTO public.books (title, author, description, cover_url, price, genre, isbn) VALUES
('The Midnight Library', 'Matt Haig', 'A magical novel about the infinite possibilities of life and the power of choice.', '/midnight-library-cover.png', 24.99, 'Fiction', '9780525559474'),
('Atomic Habits', 'James Clear', 'An easy and proven way to build good habits and break bad ones.', '/atomic-habits-inspired-cover.png', 18.99, 'Self-Help', '9780735211292'),
('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'A captivating novel about a reclusive Hollywood icon who finally decides to tell her story.', '/the-seven-husbands-of-evelyn-hugo-book-cover.png', 16.99, 'Fiction', '9781501161933'),
('Educated', 'Tara Westover', 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.', '/educated-book-cover.png', 17.99, 'Memoir', '9780399590504'),
('The Silent Patient', 'Alex Michaelides', 'A psychological thriller about a woman who refuses to speak after allegedly murdering her husband.', '/silent-patient-cover.png', 15.99, 'Thriller', '9781250301697'),
('Where the Crawdads Sing', 'Delia Owens', 'A coming-of-age mystery about a young woman who raised herself in the marshes of North Carolina.', '/where-the-crawdads-sing-book-cover.png', 19.99, 'Fiction', '9780735219090')
ON CONFLICT DO NOTHING;
