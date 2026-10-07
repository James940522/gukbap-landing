import Image from "next/image";
import { BowlIcon } from "./Icons";

type MediaFrameProps = {
  label: string;
  caption?: string;
  className?: string;
  image?: string | null;
  sizes?: string;
  priority?: boolean;
};

export function MediaFrame({
  label,
  caption = "뚝손국밥",
  className = "",
  image,
  sizes = "(max-width: 767px) 100vw, 50vw",
  priority = false,
}: MediaFrameProps) {
  return (
    <figure className={`media-frame ${image ? "has-image" : ""} ${className}`}>
      {image ? (
        <Image src={image} alt={label} fill sizes={sizes} priority={priority} />
      ) : (
        <div className="media-placeholder">
          <span className="frame-corner frame-corner-top" aria-hidden="true" />
          <BowlIcon className="placeholder-bowl" />
          <span className="placeholder-label">{label}</span>
          <span className="placeholder-note">사진 준비 중</span>
          <span
            className="frame-corner frame-corner-bottom"
            aria-hidden="true"
          />
        </div>
      )}
      <figcaption className="media-caption">
        <span>{caption}</span>
        <span>{image ? "" : "뚝손국밥"}</span>
      </figcaption>
    </figure>
  );
}
