import { Link } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'


export function LoginRegisterCta() {
  const { t } = useTranslation()

  return (
    <div className='flex text-center text-sm mt-6 gap-2 justify-center'>
      {t('newHere')}
      <Link href='#' className='underline underline-offset-4'>
        {t('registerCta')}
      </Link>
    </div>
  )
}
