import { useState, useEffect } from 'react';
import { Fire, Star, Clock, Crown } from '@phosphor-icons/react';
import type { Drama } from '../types';
import { getForYou, getTrending, getLatest, getVip } from '../api';
import HeroSection from '../components/HeroSection';
import DramaSection from '../components/DramaSection';

export default function Home() {
    const [forYou, setForYou] = useState<Drama[]>([]);
    const [trending, setTrending] = useState<Drama[]>([]);
    const [latest, setLatest] = useState<Drama[]>([]);
    const [vip, setVip] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch all data with individual error handling
                const results = await Promise.allSettled([
                    getForYou(),
                    getTrending(),
                    getLatest(),
                    getVip(),
                ]);

                // Process results
                const forYouData = results[0].status === 'fulfilled' && Array.isArray(results[0].value?.data)
                    ? results[0].value.data : [];
                const trendingData = results[1].status === 'fulfilled' && Array.isArray(results[1].value?.data)
                    ? results[1].value.data : [];
                const latestData = results[2].status === 'fulfilled' && Array.isArray(results[2].value?.data)
                    ? results[2].value.data : [];
                const vipData = results[3].status === 'fulfilled' && Array.isArray(results[3].value?.data)
                    ? results[3].value.data : [];

                setForYou(forYouData);
                setTrending(trendingData);
                setLatest(latestData);
                setVip(vipData);

                console.log('Data loaded:', { forYou: forYouData.length, trending: trendingData.length, latest: latestData.length, vip: vipData.length });
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Rotate hero
    useEffect(() => {
        if (trending.length > 0) {
            const interval = setInterval(() => {
                setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [trending]);

    const heroDrama = trending.length > 0 ? trending[heroIndex] : null;

    return (
        <div className="home-page">
            <HeroSection drama={heroDrama} loading={loading} />

            <div className="container">
                {/* Trending Section */}
                <DramaSection
                    title="Trending"
                    icon={<Fire size={24} weight="fill" />}
                    dramas={trending}
                    viewMoreLink="/trending"
                    loading={loading}
                />

                {/* VIP / Eksklusif Section */}
                <DramaSection
                    title="Eksklusif VIP"
                    icon={<Crown size={24} weight="fill" />}
                    dramas={vip}
                    loading={loading}
                />

                {/* For You Section */}
                <DramaSection
                    title="For You"
                    icon={<Star size={24} weight="fill" />}
                    dramas={forYou}
                    loading={loading}
                />

                {/* Latest Section */}
                <DramaSection
                    title="Terbaru"
                    icon={<Clock size={24} weight="fill" />}
                    dramas={latest}
                    viewMoreLink="/latest"
                    loading={loading}
                />
            </div>

            <style>{`
        .home-page {
          min-height: 100vh;
        }
      `}</style>
        </div>
    );
}
