export default {
    props: ["pagination", "getPageProducts"],
    template: `
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{disabled: !pagination.has_pre}">
                <a class="page-link" href="javascript:;" aria-label="Previous"
                @click.prevent="getPageProducts(pagination.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li v-for="page in pagination.total_pages" :key="page + 'for pagination'" class="page-item"
                :class="{active: page === pagination.current_page}">
                <a class="page-link" href="javascript:;" @click.prevent="getPageProducts(page)">{{ page
                    }}</a>
            </li>
            <li class="page-item" :class="{disabled: !pagination.has_next}">
                <a class="page-link" href="javascript:;" aria-label="Next"
                @click.prevent="getPageProducts(pagination.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
    `
}