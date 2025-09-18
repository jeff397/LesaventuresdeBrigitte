import { useParams } from "react-router-dom";
import ArticleForm from "../../components/ArticleForm/ArticleForm";

function EditArticle() {
  const { id } = useParams();
  return <ArticleForm articleId={id} />;
}

export default EditArticle;
