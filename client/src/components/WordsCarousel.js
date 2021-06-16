import React, { useState } from 'react';
import { Carousel } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './WordsCarousel.css';

function WordsCarousel({words}) {
    const [displayMeanig, setDisplayMeaning] = useState(false);

    const contentStyle = {
        height: '300px',
        color: '#fff',
        lineHeight: '300px',
        textAlign: 'center',
        background: '#364d79',
    };

    const clickWord = (e) => setDisplayMeaning(!displayMeanig);
    const beforeChangeHandler = () => setDisplayMeaning(false);

    const renderWords = words.map((word, index) => {
        return (
            <div>
                <h2 
                    style={contentStyle}
                    value={word.word}     
                    onClick={clickWord}
                >{`${index + 1}. `} {displayMeanig ? word.meaning : word.word}</h2>
            </div>
        )
    });

    return (
        <div >
            <Carousel
                dots={false}
                effect="fade"
                arrows 
                nextArrow={<ArrowRightOutlined/>} 
                prevArrow={<ArrowLeftOutlined/>}
                beforeChange={beforeChangeHandler}
                style={{ width: '600px', margin: '0 auto' }}
            >
                {renderWords}
            </Carousel>
        </div>
      )
}

export default WordsCarousel;
