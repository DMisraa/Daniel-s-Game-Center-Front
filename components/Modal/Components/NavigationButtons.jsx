import Image from "next/image"

function NavigationButtons({ closeEmailInvite, closeModal}) {
    return (
     <>
        <Image
          src="/goBack_icon.png"
          alt="Go back icon"
          width={30}
          height={30}
          onClick={closeEmailInvite}
        />
        <Image
          src="/close_icon.png"
          alt="close icoDn"
          width={32}
          height={32}
          onClick={closeModal}
        />
        </>
    )
}

export default NavigationButtons