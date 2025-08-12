import { useI18n } from "@/lib/i18n"

const PropertiesContent = () => {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t("Properties")}</h1>
      <p>{t("This is the properties content.")}</p>
    </div>
  )
}

export default PropertiesContent
