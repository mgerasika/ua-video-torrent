import React, { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { css } from 'twin.macro'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface IProps {
  imgSrc: string
  url: string
}
export const VideoPlayer = ({ imgSrc, url }: IProps) => {
  const [playing, setPlaying] = useState(false)
  const handlePlay = useCallback(() => {
    console.log('play')
  }, [])

  return (
    <div tw="py-2 px-2">
      <ReactPlayer
        playing={playing}
        onPlay={handlePlay}
        onClickPreview={() => setPlaying(true)}
        light={<img src={imgSrc} alt="Thumbnail" />}
        tw="mt-2"
        css={styles.root}
        url={url}
        width="100%"
        height="100%"
        controls
      />
    </div>
  )
}

const styles = {
  root: css``,
}
